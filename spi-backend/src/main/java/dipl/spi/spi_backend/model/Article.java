package dipl.spi.spi_backend.model;

import dipl.spi.spi_backend.dto.ArticleDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private double price;

    @OneToMany(mappedBy="article", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<PaymentSplit> paymentSplits;

    @ManyToOne(fetch = FetchType.LAZY)
    private AppUser user;


    public Article(ArticleDto articleDto, AppUser appUser) {
        this.id = articleDto.getId();
        this.name = articleDto.getName();
        this.price = articleDto.getPrice();

        this.paymentSplits = new ArrayList<>();
        this.user = appUser;
    }
}

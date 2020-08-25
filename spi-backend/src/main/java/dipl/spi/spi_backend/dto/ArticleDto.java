package dipl.spi.spi_backend.dto;

import dipl.spi.spi_backend.model.Article;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@NoArgsConstructor
@Getter
@Setter
public class ArticleDto {

    private Long id;
    private Long userId;

    private String name;
    private double price;

    private List<PaymentSplitDto> paymentSplits;

    public ArticleDto(Article article) {
        this.id = article.getId();
        this.userId = article.getUser().getId();
        this.name = article.getName();
        this.price = article.getPrice();

        this.paymentSplits = article.getPaymentSplits()
                .stream()
                .map(PaymentSplitDto::new)
                .collect(Collectors.toList());
    }
}
